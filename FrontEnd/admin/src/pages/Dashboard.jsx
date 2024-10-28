import React from 'react'
import './Dashboard.scss'
import Navbar from '../components/Navbar/Navbar'
import Cards from '../components/Cards/Cards';

function Dashboard() {
    const cardsData = [
        { id: 1, title: 'Total Products', content: '0' },
        { id: 2, title: 'Total Sales', content: '0' },
        { id: 3, title: 'Out of Stack', content: '0' },
        { id: 4, title: 'All Catagory', content: '0' },
      ];
  return (
    <div className='dashboard'>
        <div className='details'>
            {cardsData.map((card)=>(
                <Cards key={card.id} title={card.title} content={card.content}/>
            ))}

        </div>
        <div className="productList">

        </div>

        
    </div>
  )
}

export default Dashboard