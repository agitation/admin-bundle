<?php
declare(strict_types=1);
/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Seed;

use Agit\IntlBundle\Tool\Translate;
use Agit\SeedBundle\Event\SeedEvent;

class UserCapabilitySeed
{
    public function registerSeed(SeedEvent $event)
    {
        $capabilities = [
            ['id' => 'admin.setting.read', 'name' => Translate::noopX('user capability', 'Load settings')],
            ['id' => 'admin.setting.write', 'name' => Translate::noopX('user capability', 'Save settings')]
        ];

        foreach ($capabilities as $capability)
        {
            $event->addSeedEntry('AgitUserBundle:UserCapability', $capability);
        }
    }
}
