<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Api\Object\AbstractRequestObject;
use Agit\ApiBundle\Api\Object\SearchOrderInterface;
use Agit\ApiBundle\Api\Object\SearchOrderTrait;
use Agit\ApiBundle\Api\Object\SearchPaginationInterface;
use Agit\ApiBundle\Api\Object\SearchPaginationTrait;

/**
 * @Object\Object(namespace="admin.v1")
 */
class EntitySearchRequestObject extends AbstractRequestObject implements SearchPaginationInterface, SearchOrderInterface
{
    use SearchPaginationTrait;
    use SearchOrderTrait;
}
