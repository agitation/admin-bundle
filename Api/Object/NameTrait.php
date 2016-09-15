<?php

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Property;

trait NameTrait
{
    /**
     * @Property\Name("Name")
     * @Property\StringType(nullable=true)
     */
    public $name;
}
