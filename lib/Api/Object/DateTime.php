<?php
declare(strict_types=1);

/*
 * @package    agitation/admin-bundle
 * @link       http://github.com/agitation/admin-bundle
 * @author     Alexander Günsche
 * @license    http://opensource.org/licenses/MIT
 */

namespace Agit\AdminBundle\Api\Object;

use Agit\ApiBundle\Annotation\Object;
use Agit\ApiBundle\Annotation\Property;
use Agit\ApiBundle\Api\Object\DateTime as BaseDateTime;

/**
 * @Object\Object(namespace="admin.v1")
 *
 * DateTime object which includes seconds. Useful for logs etc.
 */
class DateTime extends BaseDateTime
{
    /**
     * @Property\IntegerType(minValue=0, maxValue=59)
     */
    public $second;

    public function __toString()
    {
        return sprintf('%04d-%02d-%02d %02d:%02d:00', $this->year, $this->month, $this->day, $this->hour, $this->minute, $this->second);
    }

    public function fill($dateTime)
    {
        parent::fill($dateTime);

        if ($dateTime instanceof \DateTime)
        {
            $this->second = (int) $dateTime->format('s');
        }
    }
}
