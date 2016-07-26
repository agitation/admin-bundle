<?php

namespace Agit\AdminBundle\Api\SearchObject;

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
