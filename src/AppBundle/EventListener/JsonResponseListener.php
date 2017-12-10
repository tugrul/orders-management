<?php


namespace AppBundle\EventListener;

use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Annotation\JsonResponse as JsonResponseAnnotation;

/**
 * Description of JsonResponseListener
 *
 * @author tugrul
 */
class JsonResponseListener
{
    protected $annotationReader;
    protected $annotation;
    
    public function __construct(AnnotationReader $annotationReader)
    {
        $this->annotationReader = $annotationReader;
    }
    
    public function onKernelController(FilterControllerEvent $event)
    {
        list($controller, $methodName) = $event->getController();
        
        $reflectionObject = new \ReflectionObject($controller);
        $reflectionMethod = $reflectionObject->getMethod($methodName);
        
        $this->annotation = $this->annotationReader->getMethodAnnotation($reflectionMethod, 
                JsonResponseAnnotation::class);
    }
    
    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        if (!empty($this->annotation)) {
            $event->setResponse(new JsonResponse($event->getControllerResult()));
        }
    }
}
