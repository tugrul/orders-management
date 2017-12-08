<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Exception\OrderException;

use AppBundle\Entity\User;
use AppBundle\Entity\Product;
use AppBundle\Entity\Order;

use AppBundle\Annotation\JsonResponse;

class OrderController extends BaseController
{   
    /**
     * 
     * @param Request $request
     * @Route("/order/search", name="order_search")
     * @JsonResponse
     * @return array
     */
    public function searchAction(Request $request)
    {
        try {
            
            $orders = $this->getOrderRepository()
                    ->findAllBySearch($request->request->get('term'), 
                    $request->request->get('range'));

        } catch (OrderException $ex) {
            return ['success' => false,
                'message' => $ex->getMessage()];
        }

        
        
        $result = ['success' => true, 
            'orders' => $orders];
        
        if (count($orders) === 0) {
            $result['message'] = 'There is no order by search criteria';
        }
        
        return $result;
    }

    /**
     * 
     * @param string $orderId
     * @Route("/order/delete/{orderId}", name="order_delete", methods={"POST"})
     * @JsonResponse
     * @return array
     */
    public function deleteAction($orderId)
    {
        $order = $this->getOrderRepository()
                ->findOneById($orderId);
        
        if (empty($order)) {
            return ['success' => false, 
                'message' => 'Order not found'];
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($order);
        $em->flush();
        
        return ['success' => true,
            'message' => 'Order removed successfully'];
    }

    /**
     * 
     * @param Request $request
     * @Route("/order/create", name="order_create", methods={"POST"})
     * @JsonResponse
     * @return array
     */
    public function createAction(Request $request)
    {
        $userId = $request->request->get('user-id');
        $productId = $request->request->get('product-id');
        $quantity = $request->request->get('quantity');

        try {
            $order = $this->prepareOrder(new Order(), $userId, $productId, $quantity);        
        } catch (OrderException $ex) {
            return ['success' => false, 
                'message' => $ex->getMessage()];
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($order);
        $em->flush();

        return ['success' => true,
            'message' => 'Order created successfully'];
    }
    
    /**
     * 
     * @param string $orderId
     * @param Request $request
     * @Route("/order/save/{orderId}", name="order_save", methods={"POST"}, requirements={"orderId": "\d+"})
     * @JsonResponse
     * @return array
     */
    public function saveAction($orderId, Request $request)
    {
        $order = $this->getOrderRepository()->findOneById($orderId);
        
        if (empty($order)) {
            return ['success' => false, 
                'message' => 'Order not found'];
        }
        
        $userId = $request->request->get('user-id');
        $productId = $request->request->get('product-id');
        $quantity = $request->request->get('quantity');
        
        try {
            $order = $this->prepareOrder($order, $userId, $productId, $quantity);        
        } catch (OrderException $ex) {
            return ['success' => false, 
                'message' => $ex->getMessage()];
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($order);
        $em->flush();

        return [
            'success' => true, 
            'message' => 'Order saved successfully'];
    }

    

    protected function prepareOrder($order, $userId, $productId, $quantity) {
        
        $user = $this->getUserRepository()->findOneById($userId);
        
        if (empty($user)) {
            throw new OrderException('User not found by id');
        }

        $product = $this->getProductRepository()->findOneById($productId);
        
        if (empty($product)) {
            throw new OrderException('Product not found by id');
        }
        
        $order->setUser($user);
        $order->setProduct($product);
        $order->setQuantity($quantity);
        $order->setDate(new \DateTime());
        
        $totalPrice = $quantity * $product->getPrice();
        
        // %20 discount for least 3 items of Pepsi Cola
        if ($product->getId() == 2 && $quantity > 2) {
            $totalPrice *= 0.80;
        }

        $order->setTotalPrice($totalPrice);
        
        return $order;
    }
    
   
}
