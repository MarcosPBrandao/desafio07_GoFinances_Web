import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  //let meutotal: string;
  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      // TODO

      const response = api.get(`/transactions`).then(response => {
        const { transactions, balance } = response.data;
        const transactionsFormatted = transactions.map(
          (transaction: Transaction) => ({
            ...transaction,
            formattedValue: formatValue(transaction.value),
            formattedDate: new Date(transaction.created_at).toLocaleDateString(
              'pt-br',
            ),
          }),
        );
        const balanceFormatted = {
          income: formatValue(balance.income),
          outcome: formatValue(balance.outcome),
          total: formatValue(balance.total)
        };
        setTransactions(transactionsFormatted);
        setBalance(balanceFormatted);
        //console.log('loadtransac ' + transactions);
        //console.log('loadbalance '+balance.income);
        //console.log('loadbalance '+balance.outcome);
        //console.log('loadbalance '+balance.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
        //const meutotal = balance.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        //balance.total = meutotal;
        //console.log('loadbalance '+balance.total);
      });
      // const response = await api.get('/transactions');
      // setTransactions(response.data.transaction);
      // setBalance(response.data.balance);
    }
    //console.log('uepassei'+{transactions});
    loadTransactions();
    // api.get(`repos/${params.repository}/issues`).then(response => {
    //   setIssues(response.data);
    // });
  }, []);
  //console.log('passei'+transactions);
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {balance.outcome}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} >
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome' && ' - '} 
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}

              {/* <tr>
                <td className="title">Website Hosting</td>
                <td className="outcome">- R$ 1.000,00</td>
                <td>Hosting</td>
                <td>19/04/2020</td>
              </tr> */}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
