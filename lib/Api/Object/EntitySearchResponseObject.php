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

/**
 * @Object\Object(namespace="admin.v1")
 */
class EntitySearchResponseObject extends AbstractResponseObject
{
    /**
     * @Property\NumberType
     *
     * The total number of results.
     */
    public $total;

    /**
     * @Property\PolymorphicType
     *
     * The actual response object list.
     */
    public $result = [];
}
