<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\ApiBundle\Annotation\Controller\Controller;
use Agit\ApiBundle\Annotation\Depends;
use Agit\ApiBundle\Annotation\Endpoint;
use Agit\ApiBundle\Api\Controller\AbstractController;
use Agit\IntlBundle\Tool\Translate;
use Agit\LoggingBundle\Service\Logger;
use Agit\SettingBundle\Service\SettingService;
use Psr\Log\LogLevel;

/**
 * @Controller(namespace="admin.v1")
 * @Depends({"@agit.setting", "@agit.logger"})
 */
class Settings extends AbstractController
{
    private $settingService;

    public function __construct(SettingService $settingService, Logger $logger)
    {
        $this->settingService = $settingService;
        $this->logger = $logger;
    }

    /**
     * @Endpoint\Endpoint(request="common.v1/ScalarString[]",response="Setting[]")
     * @Endpoint\Security(capability="entity.setting.read")
     *
     * Load application settings by setting names.
     */
    public function load(array $names)
    {
        $result = [];
        $settings = $this->settingService->getValuesOf($names);

        foreach ($settings as $name => $value) {
            $result[] = $this->createObject("Setting", ["id" => $name, "value" => $value]);
        }

        return $result;
    }

    /**
     * @Endpoint\Endpoint(request="Setting[]",response="Setting[]")
     * @Endpoint\Security(capability="entity.setting.write")
     *
     * Save application settings.
     */
    public function save(array $request)
    {
        $settings = [];
        $oldSettings = [];
        $changedSettings = [];

        foreach ($request as $entry) {
            $settings[$entry->get("id")] = $entry->get("value");
        }

        $oldSettings = $this->settingService->getValuesOf(array_keys($settings));
        $this->settingService->saveSettings($settings);

        foreach ($oldSettings as $id => $value) {
            if ($value !== $settings[$id]) {
                $changedSettings[] = $this->settingService->getNameOf($id);
            }
        }

        if (count($changedSettings)) {
            $this->logger->log(
                LogLevel::NOTICE,
                "agit.settings",
                sprintf(Translate::tl("The following settings have been changed: %s."), implode(", ", $changedSettings)),
                true
            );
        }

        return $this->load(array_keys($settings));
    }
}
