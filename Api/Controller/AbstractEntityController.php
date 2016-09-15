<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Controller;

use Agit\AdminBundle\Api\Object\DeletedInterface;
use Agit\AdminBundle\Api\Object\NameInterface;
use Agit\AdminBundle\Api\Object\OrderInterface;
use Agit\AdminBundle\Api\Object\PaginationInterface;
use Agit\ApiBundle\Api\Controller\AbstractEntityController as BaseController;
use Agit\ApiBundle\Api\Object\RequestObjectInterface;

/**
 * Extends the AbstractEntityController from the API bundle with extended
 * entity management features.
 */
abstract class AbstractEntityController extends BaseController
{
    protected function createSearchQuery(RequestObjectInterface $requestObject)
    {
        $query = parent::createSearchQuery($requestObject);

        if ($requestObject instanceof PaginationInterface) {
            $query->setFirstResult($requestObject->get("offset"));
            $query->setMaxResults($requestObject->get("limit"));
        }

        if ($requestObject instanceof OrderInterface) {
            $query->orderBy(
                "e." . $requestObject->get("orderBy"),
                $requestObject->get("orderDir")
            );
        }

        if ($requestObject instanceof NameInterface) {
            $name = $requestObject->get("name");

            if ($name) {
                $query->andWhere("e.name LIKE :term");
                $query->setParameter("term", "%$name%");
            }
        }

        if ($requestObject instanceof DeletedInterface && ! $requestObject->get("deleted")) {
            $query->andWhere("e.deleted = ?101");
            $query->setParameter(101, false);
        }

        return $query;
    }
}
