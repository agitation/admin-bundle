<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Property;

trait DeletedTrait
{
    /**
     * @Property\Name("Deleted")
     * @Property\BooleanType(nullable=true)
     *
     * Whether or not to include deleted objects in a search.
     */
    public $deleted;
}
