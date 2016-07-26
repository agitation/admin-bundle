<?php

namespace Agit\AdminBundle\Api\SearchObject;

use Agit\ApiBundle\Annotation\Property;

trait PaginationTrait
{
    /**
     * @Property\Name("Page")
     * @Property\NumberType(minValue=1, nullable=true)
     *
     * Page number. The offset is calculated by the page number multiplied by
     * the number of requested items (see below).
     */
    public $page = 1;

    /**
     * @Property\Name("Items per page")
     * @Property\NumberType(minValue=1, maxValue=200, nullable=true)
     */
    public $items = 50;
}
