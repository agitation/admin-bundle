<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\ApiBundle\Annotation\Controller;
use Agit\ApiBundle\Api\Controller\EntityGetTrait;
use Agit\ApiBundle\Api\Controller\EntitySearchTrait;

/**
 * @Controller\EntityController(namespace="admin.v1", entity="AgitUserBundle:UserCapability", cap="entity.user")
 */
class UserCapability extends AbstractEntityController
{
    use EntitySearchTrait;
    use EntityGetTrait;
}
