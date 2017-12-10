<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Annotation\JsonResponse;

class UserController extends BaseController
{
    /**
     * 
     * @param Request $request
     * @Route("/user/list", name="user_list")
     * @JsonResponse
     * @return array
     */
    public function listAction(Request $request)
    {
        return [
            'success' => true,
            'items' => $this->getUserRepository()->findAll()
        ];
    }

}
