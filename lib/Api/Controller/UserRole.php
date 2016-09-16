<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\ApiBundle\Annotation\Controller;
use Agit\AdminBundle\Api\Controller\AbstractEntityController;
use Agit\ApiBundle\Api\Controller\EntityGetTrait;
use Agit\ApiBundle\Api\Controller\EntityRemoveTrait;
use Agit\ApiBundle\Api\Controller\EntityDeleteTrait;
use Agit\ApiBundle\Api\Controller\EntityUpdateTrait;
use Agit\ApiBundle\Api\Controller\EntityCreateTrait;
use Agit\ApiBundle\Api\Controller\EntitySearchTrait;
use Agit\ApiBundle\Api\Controller\EntityUndeleteTrait;

/**
 * @Controller\EntityController(namespace="admin.v1", entity="AgitUserBundle:UserRole", cap="agit.user")
 */
class UserRole extends AbstractEntityController
{
    use EntitySearchTrait;
    use EntityGetTrait;
}
