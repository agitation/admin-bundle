<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api;

use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Annotation\Property;
use Agit\ApiBundle\Common\AbstractResponseObject;

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
