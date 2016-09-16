<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Property;
use Agit\ApiBundle\Api\Object\AbstractEntityObject;
use Agit\ApiBundle\Api\Object\IdTrait;
use Agit\ApiBundle\Api\Object\NameTrait;
use Agit\ApiBundle\Api\Object\DeletedTrait;

abstract class AbstractUser extends AbstractEntityObject
{
    use IdTrait;
    use NameTrait;
    use DeletedTrait;

    /**
     * @Property\Name("email")
     * @Property\StringType(minLength=5, maxLength=70)
     */
    public $email;

    /**
     * @Property\Name("role")
     * @Property\ObjectType(class="UserRole")
     */
    public $role;

    /**
     * @Property\Name("extra capabilities")
     * @Property\ObjectListType(class="UserCapability")
     */
    public $capabilities;
}
