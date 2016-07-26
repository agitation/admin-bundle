<?php

namespace Agit\AdminBundle\Api;

use  Agit\ApiBundle\Common\AbstractEntityController as BaseController;
use Agit\ApiBundle\Common\RequestObjectInterface;
use Agit\PluggableBundle\Strategy\Depends;

/**
 * @Depends({"@doctrine.orm.entity_manager"})
 *
 * Extends the AbstractEntityController from the API bundle with extended
 * entity management features.
 */
abstract class AbstractEntityController extends BaseController
{
    protected function createSearchQuery(RequestObjectInterface $requestObject)
    {
        $query = parent::createSearchQuery($requestObject);


        return $query;
    }
}
