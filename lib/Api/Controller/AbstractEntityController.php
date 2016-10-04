<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\ApiBundle\Api\Controller\AbstractEntityController as BaseController;
use Agit\ApiBundle\Api\Object\RequestObjectInterface;
use Agit\ApiBundle\Api\Object\SearchDeletedInterface;
use Agit\ApiBundle\Api\Object\SearchNameInterface;
use Agit\ApiBundle\Api\Object\SearchOrderInterface;
use Agit\ApiBundle\Api\Object\SearchPaginationInterface;

/**
 * Extends the AbstractEntityController from the API bundle with extended
 * entity management features.
 */
abstract class AbstractEntityController extends BaseController
{
    protected function createSearchQuery(RequestObjectInterface $requestObject)
    {
        $query = parent::createSearchQuery($requestObject);

        if ($requestObject instanceof SearchPaginationInterface) {
            $query->setFirstResult($requestObject->get("offset"));
            $query->setMaxResults($requestObject->get("limit"));
        }

        if ($requestObject instanceof SearchOrderInterface) {
            $query->orderBy(
                "e." . $requestObject->get("orderBy"),
                $requestObject->get("orderDir")
            );
        }

        if ($requestObject instanceof SearchNameInterface) {
            $name = $requestObject->get("name");

            if ($name) {
                $query->andWhere("e.name LIKE :term");
                $query->setParameter("term", "%$name%");
            }
        }

        if ($requestObject instanceof SearchDeletedInterface && ! $requestObject->get("deleted")) {
            $query->andWhere("e.deleted = ?101");
            $query->setParameter(101, false);
        }

        return $query;
    }
}
