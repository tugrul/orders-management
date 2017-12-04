<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\User;
use AppBundle\Entity\Product;

/**
 * Order
 *
 * @ORM\Table(name="orders")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\OrderRepository")
 */
class Order implements \JsonSerializable
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\JoinColumn(name="user", referencedColumnName="id")
     * @ORM\ManyToOne(targetEntity="User", inversedBy="orders")
     */
    private $user;

    /**
     * @var int
     *
     * @ORM\JoinColumn(name="product", referencedColumnName="id")
     * @ORM\ManyToOne(targetEntity="Product", inversedBy="orders")
     */
    private $product;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;


    /**
     *
     * @var int
     * @ORM\Column(name="quantity", type="integer")
     */
    private $quantity;

    
    /**
     * @var float
     * @ORM\Column(name="total_price", type="decimal", precision=8, scale=2)
     */
    private $totalPrice;
    
    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set user
     *
     * @param integer $user
     *
     * @return UserProductOrder
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return int
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set product
     *
     * @param integer $product
     *
     * @return UserProductOrder
     */
    public function setProduct($product)
    {
        $this->product = $product;

        return $this;
    }

    /**
     * Get product
     *
     * @return int
     */
    public function getProduct()
    {
        return $this->product;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return UserProductOrder
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Get quantity
     * 
     * @return int
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * Set quantity
     * 
     * @param int $quantity
     * @return $this
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Get total price
     * 
     * @return float
     */
    public function getTotalPrice()
    {
        return $this->totalPrice;
    }

    /**
     * Set total price
     * 
     * @param float $totalPrice
     * @return $this
     */
    public function setTotalPrice($totalPrice)
    {
        $this->totalPrice = $totalPrice;
        return $this;
    }

    public function jsonSerialize()
    {
        $user = $this->getUser();
        $product = $this->getProduct();
        
        return [
            'id' => $this->getId(),
            'user' => [
                'id' => $user->getId(), 
                'name' => $user->getName()],
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => number_format($product->getPrice(), 2)
            ],
            'quantity' => $this->getQuantity(),
            'total' => number_format($this->getTotalPrice(), 2),
            'date' => $this->getDate()->format('d M Y, h:iA')
        ];
    }

}

