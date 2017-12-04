<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Entity\Product;

class ProductController extends Controller
{
    /**
     * 
     * @param Request $request
     * @Route("/product/list", name="product_list", defaults={"format": "_json"})
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);
        return new JsonResponse($repository->findAll());
    }

}
