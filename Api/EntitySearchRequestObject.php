<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api;

use Agit\AdminBundle\Api\SearchObject\OrderInterface;
use Agit\AdminBundle\Api\SearchObject\OrderTrait;
use Agit\AdminBundle\Api\SearchObject\PaginationInterface;
use Agit\AdminBundle\Api\SearchObject\PaginationTrait;
use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Common\AbstractRequestObject;

/**
 * @Object\Object
 */
class EntitySearchRequestObject extends AbstractRequestObject implements PaginationInterface, OrderInterface
{
    use PaginationTrait;
    use OrderTrait;
}
