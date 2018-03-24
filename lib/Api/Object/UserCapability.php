<?php
declare(strict_types=1);

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
use Agit\ApiBundle\Api\Object\NameTrait;

/**
 * @Object\Object(namespace="admin.v1")
 */
class UserCapability extends AbstractResponseObject
{
    use NameTrait;

    /**
     * @Property\Name("ID")
     * @Property\StringType
     */
    public $id;
}
