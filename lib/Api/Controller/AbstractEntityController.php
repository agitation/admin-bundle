<?php
declare(strict_types=1);

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
        $qb = parent::createSearchQuery($requestObject);

        if ($requestObject instanceof SearchPaginationInterface)
        {
            $qb->setFirstResult($requestObject->get('offset'));
            $qb->setMaxResults($requestObject->get('limit'));
        }

        if ($requestObject instanceof SearchOrderInterface)
        {
            $qb->orderBy(
                'e.' . $requestObject->get('orderBy'),
                $requestObject->get('orderDir')
            );
        }

        if ($requestObject instanceof SearchNameInterface)
        {
            $name = $requestObject->get('name');

            if ($name)
            {
                $qb->andWhere('e.name LIKE :term');
                $qb->setParameter('term', "%$name%");
            }
        }

        if ($requestObject instanceof SearchDeletedInterface && ! $requestObject->get('deleted'))
        {
            $qb->andWhere('e.deleted = ?101');
            $qb->setParameter(101, false);
        }

        return $qb;
    }
}
