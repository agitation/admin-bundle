<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\ApiBundle\Annotation\Controller\Controller;
use Agit\ApiBundle\Annotation\Endpoint;
use Agit\ApiBundle\Annotation\Depends;
use Agit\ApiBundle\Api\Controller\AbstractController;

/**
 * @Controller(namespace="admin.v1")
 */
class Settings extends AbstractController
{
    /**
     * @Endpoint\Endpoint(request="common.v1/String[]",response="Setting[]")
     * @Endpoint\Security(capability="agit.setting.read")
     * @Depends({"@agit.setting"})
     *
     * Load application settings by setting names.
     */
    public function load(array $names)
    {
        $result = [];
        $settingList = $this->getService("agit.setting")->getSettings($names);

        foreach ($settingList as $setting) {
            $result[] = $this->createObject("Setting", (object) [
                "id" => $setting->getId(), "value" => $setting->getValue()
            ]);
        }

        return $result;
    }

    /**
     * @Endpoint\Endpoint(request="Setting[]",response="Setting[]")
     * @Endpoint\Security(capability="agit.setting.write")
     * @Depends({"@agit.setting"})
     *
     * Save application settings.
     */
    public function save(array $apiSettingList)
    {
        $settings = [];

        foreach ($apiSettingList as $apiSetting) {
            $settings[$apiSetting->get("id")] = $apiSetting->get("value");
        }

        $settingList = $this->getService("agit.setting")->getSettings(array_keys($settings));

        foreach ($settingList as $setting) {
            $setting->setValue($settings[$setting->getId()]);
        }

        $this->getService("agit.setting")->saveSettings($settingList);

        return $this->load(array_keys($settings));
    }
}
