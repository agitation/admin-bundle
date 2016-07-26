<?php

namespace Agit\AdminBundle\Api;

use Agit\ApiBundle\Common\AbstractResponseObject;
use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Annotation\Property;

/**
 * @Object\Object
 */
class EntitySearchResponseObject extends AbstractResponseObject
{
    public $total;

    /**
     * @Property\PolymorphicType
     *
     * The actual response object array.
     */
    public $result = [];
}
