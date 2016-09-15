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
use Agit\ApiBundle\Api\Object\AbstractValueObject;

/**
 * @Object\Object(namespace="admin.v1")
 *
 * An application setting.
 */
class Setting extends AbstractValueObject
{
    /**
     * @Property\StringType(minLength=3, maxLength=40)
     *
     * Identifier of the setting.
     */
    public $id;

    /**
     * @Property\PolymorphicType
     *
     * The setting value.
     */
    public $value;
}
