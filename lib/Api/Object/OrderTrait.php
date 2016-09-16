<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Property;

trait OrderTrait
{
    /**
     * @Property\Name("Order by field")
     * @Property\StringType(nullable=true)
     *
     * The field by which the result set should be ordered.
     */
    public $orderBy = "id";

    /**
     * @Property\Name("Order by field")
     * @Property\StringType(nullable=true, allowedValues={"asc", "desc"})
     *
     * The field by which the result set should be ordered.
     */
    public $orderDir = "asc";
}
