<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Exception\OrderException;

use AppBundle\Entity\User;
use AppBundle\Entity\Product;
use AppBundle\Entity\Order;

class OrderController extends Controller
{
    /**
     * 
     * @param int $orderId
     * @Route("/order/get/{orderId}", name="order_get", defaults={"format": "_json"}, requirements={"orderId": "\d+"})
     * @return JsonResponse
     */
    public function getAction($orderId)
    {
        return new JsonResponse($this->getOrderRepository()
                ->findOneById($orderId));
    }
    
    /**
     * 
     * @param Request $request
     * @Route("/order/search", name="order_search", defaults={"format": "_json"})
     * @return JsonResponse
     */
    public function searchAction(Request $request)
    {
        return new JsonResponse($this->getOrderRepository()
                ->findAllBySearch($request->request->get('term'), 
                $request->request->get('range')));
    }

    /**
     * 
     * @param Request $request
     * @Route("/order/delete", name="order_delete", defaults={"format": "_json"}, methods={"POST"})
     * @return JsonResponse
     */
    public function deleteAction()
    {
        return new JsonResponse(['success' => false]);
    }

    /**
     * 
     * @param Request $request
     * @Route("/order/create", name="order_create", defaults={"format": "_json"}, methods={"POST"})
     * @return JsonResponse
     */
    public function createAction(Request $request)
    {
        $userId = $request->request->get('user-id');
        $productId = $request->request->get('product-id');
        $quantity = $request->request->get('quantity');

        try {
            $order = $this->prepareOrder(new Order(), $userId, $productId, $quantity);        
        } catch (OrderException $ex) {
            return new JsonResponse(['success' => false, 
                'message' => $ex->getMessage()]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($order);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }
    
    /**
     * 
     * @param string $orderId
     * @param Request $request
     * @Route("/order/save/{orderId}", name="order_save", defaults={"format": "_json"}, methods={"POST"}, requirements={"orderId": "\d+"})
     * @return JsonResponse
     */
    public function saveAction($orderId, Request $request)
    {
        $order = $this->getOrderRepository()->findOneById($orderId);
        
        if (empty($order)) {
            return new JsonResponse(['success' => false, 'message' => 'Order not found']);
        }
        
        $userId = $request->request->get('user-id');
        $productId = $request->request->get('product-id');
        $quantity = $request->request->get('quantity');

        try {
            $order = $this->prepareOrder($order, $userId, $productId, $quantity);        
        } catch (OrderException $ex) {
            return new JsonResponse(['success' => false, 
                'message' => $ex->getMessage()]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($order);
        $em->flush();

        return new JsonResponse(['success' => true, 'order' => $order]);
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
