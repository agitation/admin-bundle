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

class LogentryCategorySeed
{
    public function registerSeed(SeedEvent $event)
    {
        $event->addSeedEntry('AgitLoggingBundle:LogentryCategory', [
            'id' => 'agit.settings',
            'name' => Translate::noopX('logging category', 'Settings')
        ]);
    }
}
