<?php

namespace Drupal\robotstxt_json\Controller;

use Drupal\Core\Cache\CacheableResponse;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Controller router for sitemap links.
 */
class RobotstxtJson extends ControllerBase {

  /**
   * RobotsTxt module 'robotstxt.settings' configuration.
   *
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $moduleConfig;

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * Constructs a RobotsTxtController json object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config
   *   Configuration object factory.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler service.
 */
  public function __construct(ConfigFactoryInterface $config, ModuleHandlerInterface $module_handler) {
    $this->moduleConfig = $config->get('robotstxt.settings');
    $this->moduleHandler = $module_handler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_handler')

    );
  }

  /**
   * Handles the /api/robotstxt route.
   *
   * @return \Drupal\Core\Cache\CacheableResponse
   *   A JSON response containing the sitemap links.
   *
   * @throws \JsonException
   * @throws \Exception
   */
  public function viewRobotstxt() {
    $content = [];
    $content[] = $this->moduleConfig->get('content');

    // Hook other modules for adding additional lines.
    if ($additions = $this->moduleHandler->invokeAll('robotstxt')) {
      $content = array_merge($content, $additions);
    }

    // Trim any extra whitespace and filter out empty strings.
    $content = array_map('trim', $content);
    $content = array_filter($content);
    $content = implode("\n", $content);
    $lines = explode("\n", $content);

    $policies = [];
    $currentPolicy = null;

    foreach ($lines as $line) {
      $line = trim($line);

      if (empty($line) || strpos($line, '#') === 0) {
        // Skip empty lines and comments
        continue;
      }

      if (strpos($line, 'User-agent:') === 0) {
        if ($currentPolicy) {
          $policies[] = $currentPolicy;
        }
        $currentPolicy = [
          'userAgent' => trim(substr($line, strlen('User-agent:'))),
          'allow' => [],
          'disallow' => []
        ];
      } elseif (strpos($line, 'Allow:') === 0) {
        if ($currentPolicy) {
          $currentPolicy['allow'][] = trim(substr($line, strlen('Allow:')));
        }
      } elseif (strpos($line, 'Disallow:') === 0) {
        if ($currentPolicy) {
          $currentPolicy['disallow'][] = trim(substr($line, strlen('Disallow:')));
        }
      }
    }

    if ($currentPolicy) {
      $policies[] = $currentPolicy;
    }

    $formattedPolicies = [];

    foreach ($policies as $policy) {
      $formattedPolicy = [
        'userAgent' => $policy['userAgent'],
      ];

      if (!empty($policy['allow'])) {
        $formattedPolicy['allow'] = $policy['allow'];
      }

      if (!empty($policy['disallow'])) {
        $formattedPolicy['disallow'] = $policy['disallow'];
      }

      $formattedPolicies[] = $formattedPolicy;
    }

    $result = [
      'robotsTxtOptions' => [
        'policies' => $formattedPolicies
      ]
    ];

    $jsonResult = json_encode($result, JSON_PRETTY_PRINT);

    $response = new CacheableResponse($jsonResult, Response::HTTP_OK, ['content-type' => 'application/json']);
    $meta_data = $response->getCacheableMetadata();
    $meta_data->addCacheTags(['robotstxt']);

    return $response;
  }

}
