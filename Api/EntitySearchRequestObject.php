<?php

namespace Agit\AdminBundle\Api;

use Agit\ApiBundle\Common\AbstractRequestObject;
use Agit\ApiBundle\Annotation\Object;
use Agit\AdminBundle\Api\SearchObject\PaginationTrait;

/**
 * @Object\Object
 */
class EntitySearchRequestObject extends AbstractRequestObject
{
    use PaginationTrait;
}
