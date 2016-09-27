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
use Agit\SettingBundle\Service\SettingService;

/**
 * @Controller(namespace="admin.v1")
 * @Depends({"@agit.setting"})
 */
class Settings extends AbstractController
{
    private $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * @Endpoint\Endpoint(request="common.v1/String[]",response="Setting[]")
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

        foreach ($request as $entry) {
            $settings[$entry->get("id")] = $entry->get("value");
        }

        $this->settingService->saveSettings($settings);

        return $this->load(array_keys($settings));
    }
}
