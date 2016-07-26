<?php

namespace Agit\AdminBundle\Api;

use Agit\ApiBundle\Common\AbstractRequestObject;
use Agit\ApiBundle\Annotation\Object;
use Agit\AdminBundle\Api\SearchObject\OrderInterface;
use Agit\AdminBundle\Api\SearchObject\OrderTrait;
use Agit\AdminBundle\Api\SearchObject\PaginationInterface;
use Agit\AdminBundle\Api\SearchObject\PaginationTrait;

/**
 * @Object\Object
 */
class EntitySearchRequestObject extends AbstractRequestObject implements PaginationInterface, OrderInterface
{
    use PaginationTrait;
    use OrderTrait;
}
