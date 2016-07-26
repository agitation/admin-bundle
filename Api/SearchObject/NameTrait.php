<?php

namespace Agit\AdminBundle\Api\SearchObject;

use Agit\ApiBundle\Annotation\Property;

trait NameTrait
{
    /**
     * @Property\Name("Name")
     * @Property\StringType(nullable=true)
     */
    public $name;
}
