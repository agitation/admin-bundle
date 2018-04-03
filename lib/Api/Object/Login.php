<?php
declare(strict_types=1);

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Object\Object;
use Agit\ApiBundle\Annotation\Property;
use Agit\ApiBundle\Api\Object\AbstractRequestObject;

/**
 * @Object(namespace="admin.v1")
 */
class Login extends AbstractRequestObject
{
    /**
     * @Property\StringType
     */
    public $email;

    /**
     * @Property\StringType
     */
    public $password;
}
