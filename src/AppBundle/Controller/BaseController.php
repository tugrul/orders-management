<?php


namespace AppBundle\Controller;

use AppBundle\Entity\User;
use AppBundle\Entity\Product;
use AppBundle\Entity\Order;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Helper methods
 *
 * @author Tuğrul Topuz <tugrultopuz@gmail.com>
 */
class BaseController extends Controller
{
    protected function getOrderRepository()
    {
        return $this->getDoctrine()->getRepository(Order::class);
    }
    
    protected function getUserRepository()
    {
        return $this->getDoctrine()->getRepository(User::class);
    }
    
    protected function getProductRepository()
    {
        return $this->getDoctrine()->getRepository(Product::class);
    } 
}
