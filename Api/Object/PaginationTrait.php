<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Property;

trait PaginationTrait
{
    /**
     * @Property\Name("Start offset")
     * @Property\NumberType(minValue=0)
     */
    public $offset = 0;

    /**
     * @Property\Name("Items per page")
     * @Property\NumberType(minValue=1, maxValue=200)
     */
    public $limit = 50;
}
