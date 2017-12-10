<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Annotation\JsonResponse;

class ProductController extends BaseController
{
    /**
     * 
     * @param Request $request
     * @Route("/product/list", name="product_list")
     * @JsonResponse
     * @return array
     */
    public function listAction(Request $request)
    {
        return [
            'success' => true,
            'items' => $this->getProductRepository()->findAll()
        ];
    }

}
