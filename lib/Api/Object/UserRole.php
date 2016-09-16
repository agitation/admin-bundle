<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Annotation\Property;
use Agit\ApiBundle\Api\Object\AbstractResponseObject;
use Agit\ApiBundle\Api\Object\IdTrait;
use Agit\ApiBundle\Api\Object\NameTrait;

/**
 * @Object\Object(namespace="admin.v1")
 */
class UserRole extends AbstractResponseObject
{
    use IdTrait;
    use NameTrait;

    /**
     * @Property\Name("isSuper")
     * @Property\BooleanType
     */
    public $isSuper;

    /**
     * @Property\Name("capabilities")
     * @Property\ObjectListType(class="UserCapability")
     */
    public $capabilities;
}
