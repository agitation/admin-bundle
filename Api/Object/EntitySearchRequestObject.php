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

/**
 * @Object\Object
 */
class EntitySearchRequestObject extends AbstractRequestObject implements PaginationInterface, OrderInterface
{
    use PaginationTrait;
    use OrderTrait;
}
