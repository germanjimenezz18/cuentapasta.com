"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MonthlyData {
  cash: number | null
  banks: number | null
  crypto: number | null
  total: number | null
  profit: number | null
}

type YearlyData = Record<string, MonthlyData>

const months = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
]

const categories = ["cash", "banks", "crypto"] as const

const initialData: Record<string, YearlyData> = {
  "2023": {
    "ENERO": { cash: 1210, banks: 3470, crypto: 0, total: 4680, profit: 0 },
    "FEBRERO": { cash: 1160, banks: 3900, crypto: 0, total: 5060, profit: 380 },
    "MARZO": { cash: 1120, banks: 3495, crypto: 0, total: 4615, profit: -445 },
    "ABRIL": { cash: 1420, banks: 3595, crypto: 0, total: 5015, profit: 400 },
    "MAYO": { cash: 1520, banks: 3734, crypto: 0, total: 5254, profit: 239 },
    "JUNIO": { cash: 1520, banks: 3100, crypto: 0, total: 4620, profit: -634 },
    "JULIO": { cash: 1480, banks: 2666, crypto: 0, total: 4146, profit: -474 },
    "AGOSTO": { cash: 1500, banks: 2125, crypto: 0, total: 3625, profit: -521 },
    "SEPTIEMBRE": { cash: 1540, banks: 2545, crypto: 0, total: 4085, profit: 460 },
    "OCTUBRE": { cash: 1660, banks: 3225, crypto: 132, total: 5017, profit: 932 },
    "NOVIEMBRE": { cash: 1640, banks: 4030, crypto: 130, total: 5800, profit: 783 },
    "DICIEMBRE": { cash: 1690, banks: 4366, crypto: 130, total: 6186, profit: 386 }
  },
  "2024": {
    "ENERO": { cash: 1700, banks: 4400, crypto: 150, total: 6250, profit: 64 },
    "FEBRERO": { cash: 1750, banks: 4500, crypto: 200, total: 6450, profit: 200 },
    "MARZO": { cash: 1800, banks: 4600, crypto: 250, total: 6650, profit: 200 },
    "ABRIL": { cash: 1850, banks: 4700, crypto: 300, total: 6850, profit: 200 },
    "MAYO": { cash: 1900, banks: 4800, crypto: 350, total: 7050, profit: 200 },
    "JUNIO": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "JULIO": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "AGOSTO": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "SEPTIEMBRE": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "OCTUBRE": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "NOVIEMBRE": { cash: null, banks: null, crypto: null, total: null, profit: null },
    "DICIEMBRE": { cash: null, banks: null, crypto: null, total: null, profit: null }
  }
}

export default function MoneyTracker() {
  const [allData, setAllData] = useState<Record<string, YearlyData>>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('moneyTrackerData')
      return savedData ? JSON.parse(savedData) : initialData
    }
    return initialData
  })
  const [selectedYear, setSelectedYear] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedYear') || "2024"
    }
    return "2024"
  })
  const [data, setData] = useState(allData[selectedYear])

  useEffect(() => {
    const updatedData = { ...data }
    let previousTotal: number | null = null

    months.forEach((month, index) => {
      const total = categories.reduce((sum, category) => {
        const value = updatedData[month][category]
        return value !== null ? sum + value : sum
      }, 0)
      updatedData[month].total = total || null
      updatedData[month].profit = index === 0 || previousTotal === null ? null : total - previousTotal
      previousTotal = total || null
    })

    setData(updatedData)
    setAllData(prevAllData => {
      const newAllData = { ...prevAllData, [selectedYear]: updatedData }
      localStorage.setItem('moneyTrackerData', JSON.stringify(newAllData))
      return newAllData
    })
  }, [selectedYear])

  useEffect(() => {
    localStorage.setItem('selectedYear', selectedYear)
  }, [selectedYear])

  const handleCellChange = (month: string, category: typeof categories[number], value: string) => {
    const numericValue = value === '' ? null : parseFloat(value)
    const updatedData = { ...data }
    updatedData[month][category] = numericValue

    let previousTotal: number | null = null
    for (let i = 0; i < months.length; i++) {
      const currentMonth = months[i]
      const total = categories.reduce((sum, cat) => {
        const value = updatedData[currentMonth][cat]
        return value !== null ? sum + value : sum
      }, 0)
      updatedData[currentMonth].total = total || null
      updatedData[currentMonth].profit = i === 0 || previousTotal === null ? null : total - previousTotal
      previousTotal = total || null
    }

    setData(updatedData)
    setAllData(prevAllData => {
      const newAllData = { ...prevAllData, [selectedYear]: updatedData }
      localStorage.setItem('moneyTrackerData', JSON.stringify(newAllData))
      return newAllData
    })
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setData(allData[year])
  }

  const totalProfit = Object.values(data).reduce((sum, month) => {
    return month.profit !== null ? sum + month.profit : sum
  }, 0)

  const initialValue = data["ENERO"].total ?? 0
  const finalValue = data["DICIEMBRE"].total ?? initialValue
  const yearlyReturn = initialValue !== 0 ? ((finalValue - initialValue) / initialValue) * 100 : 0

  const chartData = months.map(month => ({
    name: month,
    total: data[month].total ?? undefined
  }))

  const currentTotal = Object.values(data).reduce((sum, month) => {
    return month.total !== null ? sum + month.total : sum
  }, 0) / Object.values(data).filter(month => month.total !== null).length

  const latestMonth = months.filter(month => data[month].total !== null).pop() || months[0]
  const donutData = categories.map(category => ({
    name: category,
    value: data[latestMonth][category] ?? 0
  }))

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Año</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un año" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(allData).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Para el año {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retorno Anual</CardTitle>
            {yearlyReturn > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyReturn.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">De {initialValue} a {finalValue}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  total: {
                    label: "Total",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categorías (Último Mes con Datos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  cash: {
                    label: "Efectivo",
                    color: COLORS[0],
                  },
                  banks: {
                    label: "Bancos",
                    color: COLORS[1],
                  },
                  crypto: {
                    label: "Criptomonedas",
                    color: COLORS[2],
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suma del Dinero Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">€{currentTotal.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Promedio mensual para {selectedYear}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cuenta Pasta {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Categoría</TableHead>
                  {months.map(month => (
                    <TableHead key={month} className="text-right">{month}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category} className={`bg-green-50/50 dark:bg-green-950/${20 - index * 5}`}>
                    <TableCell className="font-medium capitalize">{category}</TableCell>
                    {months.map(month => (
                      <TableCell key={month} className="text-right p-0">
                        <Input
                          type="number"
                          value={data[month][category] !== null ? data[month][category] : ''}
                          onChange={(e) => handleCellChange(month, category, e.target.value)}
                          className="text-right border-0 h-full"
                          placeholder="-"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="bg-orange-50 dark:bg-orange-950/20 font-medium">
                  <TableCell>TOTAL</TableCell>
                  {months.map(month => (
                    <TableCell key={month} className="text-right">
                      {data[month].total !== null ? data[month].total.toFixed(2) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">BENEFICIO</TableCell>
                  {months.map(month => (
                    <TableCell 
                      key={month} 
                      className={`text-right ${
                        data[month].profit !== null && data[month].profit > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : data[month].profit !== null && data[month].profit < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : ''
                      }`}
                    >
                      {data[month].profit !== null ? data[month].profit.toFixed(2) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

