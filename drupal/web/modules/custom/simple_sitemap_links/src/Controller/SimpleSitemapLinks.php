<?php

namespace Drupal\simple_sitemap_links\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Routing\UrlGeneratorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller router for sitemap links.
 */
class SimpleSitemapLinks extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The database service.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * The URL generator.
   */
  protected UrlGeneratorInterface $urlGenerator;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * SimpleSitemapLinksController constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\Core\Database\Connection $database
   *   The database service.
   * @param \Drupal\Core\Routing\UrlGeneratorInterface $url_generator
   *   The URL generator.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, Connection $database, UrlGeneratorInterface $url_generator, LanguageManagerInterface $language_manager) {
    $this->entityTypeManager = $entity_type_manager;
    $this->database = $database;
    $this->urlGenerator = $url_generator;
    $this->languageManager = $language_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('database'),
      $container->get('url_generator'),
      $container->get('language_manager')
    );
  }

  /**
   * Handles the /api/simple-sitemap-links/{sitemap} route.
   *
   * @param string $sitemap
   *   The sitemap identifier.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the sitemap links.
   *
   * @throws \JsonException
   * @throws \Exception
   */
  public function viewSitemap($sitemap) {
    if (!$sitemap) {
      $sitemap_urls = [];
      $variants = $this->getSitemapVariants();
      foreach ($variants as $variant) {
        $sitemap_urls[] = $this->getVariantUrl($variant);
      }
      return new JsonResponse($sitemap_urls);
    }

    $xml_string = $this->getXmlString($sitemap);
    if ($xml_string) {
      // Fix issue to get image urls.
      $xml_string = str_replace('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', '', $xml_string);

      $xml_element = new \SimpleXMLElement($xml_string);
      $xml_element->registerXPathNamespace('xhtml', 'http://www.w3.org/1999/xhtml');
      $xml_element->registerXPathNamespace('image', 'http://www.google.com/schemas/sitemap-image/1.1');

      $urls = $xml_element->xpath('//url');

      if (empty($urls)) {
        $urls_decoded = json_decode(json_encode($xml_element, JSON_THROW_ON_ERROR), FALSE, 512, JSON_THROW_ON_ERROR);
        return new JsonResponse($urls_decoded->sitemap);
      }
      $formated_urls = $this->buildUrls($urls);

      return new JsonResponse($formated_urls);
    }

    return new JsonResponse(['error' => 'Sitemap not found'], 404);
  }

  /**
   * Get XML for given sitemap from database.
   *
   * @param string $sitemap
   *   Sitemap name.
   *
   * @return mixed
   *   XML value string.
   *
   * @throws \Exception
   */
  private function getXmlString(string $sitemap) {
    $query = $this->database->select('simple_sitemap', 'ss')
      ->fields('ss', ['sitemap_string'])
      ->condition('type', $sitemap);
    return $query->execute()->fetchField();
  }

  /**
   * Build urls from the sitemap.
   *
   * @param false|array|null $urls
   *   XML objects.
   *
   * @return array
   *   Structured data with links.
   *
   * @throws \JsonException
   */
  private function buildUrls(false|array|null $urls) {
    $formated_urls = [];
    foreach ($urls as $url) {
      $item = json_decode(json_encode($url, JSON_THROW_ON_ERROR), FALSE, 512, JSON_THROW_ON_ERROR);
      $image_elements = $url->xpath('image:image/image:loc');
      $images = [];
      foreach ($image_elements as $image_element) {
        $image_url = (string) $image_element;
        $images[] = ['loc' => $image_url];
      }
      if (!empty($images)) {
        $item->images = $images;
      }
      $formated_urls[] = $item;
    }
    return $formated_urls;
  }

  /**
   * Get sitemap variants.
   *
   * @return array
   *   Array of variants;
   *
   * @throws \Exception
   */
  private function getSitemapVariants() {
    $query = $this->database->select('simple_sitemap', 'ss')
      ->fields('ss', ['type']);
    return $query->execute()->fetchCol();
  }

  /**
   * Get url of a simple sitemap.
   *
   * @param mixed $variant
   *   Name of variant.
   * @param bool $absolute
   *   Absolute path or not.
   * @param bool $path_processing
   *   Include language.
   *
   * @return \Drupal\Core\GeneratedUrl|string
   *   Url of the sitemap.
   */
  private function getVariantUrl(mixed $variant, bool $absolute = TRUE, bool $path_processing = FALSE) {
    $url = $this->urlGenerator->generateFromRoute(
      'simple_sitemap.sitemap_variant',
      ['variant' => $variant],
      [
        'absolute' => $absolute,
        'language' => $this->languageManager->getLanguage(LanguageInterface::LANGCODE_NOT_SPECIFIED),
        'path_processing' => $path_processing,
      ],
    );
    return $url ?? '';
  }

}
