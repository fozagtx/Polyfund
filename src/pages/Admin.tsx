import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, CheckCircle, XCircle, Clock, Building2, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { mockBusinesses } from '@/data/mockData';
import { POLYFUNDS_CONTRACT_ADDRESS } from '@/config/contracts';

// Admin wallet address (contract deployer) - in production, this would be fetched from the contract
const ADMIN_WALLET = '0x0000000000000000000000000000000000000000';

interface PendingBusiness {
  id: number;
  name: string;
  description: string;
  category: string;
  owner: string;
  tokenSupply: number;
  tokenPrice: number;
  monthlyRevenue: number;
  profitMargin: number;
  isVerified: boolean;
  isActive: boolean;
  submittedAt: Date;
}

// Mock pending businesses for demo
const initialPendingBusinesses: PendingBusiness[] = [
  {
    id: 7,
    name: 'CryptoPayments Inc',
    description: 'Decentralized payment gateway for merchants worldwide.',
    category: 'Finance',
    owner: '0x7890123456789012345678901234567890123456',
    tokenSupply: 500000,
    tokenPrice: 0.025,
    monthlyRevenue: 75000,
    profitMargin: 32,
    isVerified: false,
    isActive: true,
    submittedAt: new Date('2024-12-24'),
  },
  {
    id: 8,
    name: 'EcoFarm Organics',
    description: 'Vertical farming technology for urban agriculture.',
    category: 'Food & Beverage',
    owner: '0x8901234567890123456789012345678901234567',
    tokenSupply: 200000,
    tokenPrice: 0.018,
    monthlyRevenue: 45000,
    profitMargin: 24,
    isVerified: false,
    isActive: true,
    submittedAt: new Date('2024-12-23'),
  },
  {
    id: 9,
    name: 'VRWorld Studios',
    description: 'Virtual reality content creation and distribution platform.',
    category: 'Entertainment',
    owner: '0x9012345678901234567890123456789012345678',
    tokenSupply: 350000,
    tokenPrice: 0.035,
    monthlyRevenue: 120000,
    profitMargin: 40,
    isVerified: false,
    isActive: true,
    submittedAt: new Date('2024-12-22'),
  },
  ...mockBusinesses.filter(b => !b.isVerified).map(b => ({
    ...b,
    submittedAt: new Date('2024-12-20'),
  })),
];

export default function Admin() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>(initialPendingBusinesses);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Check if connected wallet is admin (contract deployer)
  // In production, this would check against the actual contract owner
  const isAdmin = isConnected && (
    address?.toLowerCase() === ADMIN_WALLET.toLowerCase() ||
    ADMIN_WALLET === '0x0000000000000000000000000000000000000000' // Demo mode - allow any connected wallet
  );

  const handleApprove = async (businessId: number, businessName: string) => {
    setProcessingId(businessId);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPendingBusinesses(prev => prev.filter(b => b.id !== businessId));
    
    toast({
      title: 'Business Approved',
      description: `${businessName} has been verified and is now listed on the platform.`,
    });
    
    setProcessingId(null);
  };

  const handleReject = async (businessId: number, businessName: string) => {
    setProcessingId(businessId);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPendingBusinesses(prev => prev.filter(b => b.id !== businessId));
    
    toast({
      title: 'Business Rejected',
      description: `${businessName} listing has been rejected.`,
      variant: 'destructive',
    });
    
    setProcessingId(null);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <GlassCard className="max-w-md text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to access the admin dashboard.
            </p>
            <ConnectButton />
          </GlassCard>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <GlassCard className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Only the contract deployer can access this dashboard.
            </p>
            <p className="text-sm text-muted-foreground">
              Connected: {formatAddress(address || '')}
            </p>
          </GlassCard>
        </div>
      </Layout>
    );
  }

  const pendingCount = pendingBusinesses.length;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage business listings and platform verification
            </p>
          </div>
          <Badge variant="outline" className="self-start md:self-auto text-sm px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Admin: {formatAddress(address || '')}
          </Badge>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified Businesses</p>
              <p className="text-2xl font-bold">{mockBusinesses.filter(b => b.isVerified).length}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <p className="text-2xl font-bold">{mockBusinesses.length + pendingCount}</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Pending Businesses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Verification
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review and approve business listings before they go live
              </p>
            </div>

            {pendingCount === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">All caught up! No pending verifications.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Token Supply</TableHead>
                      <TableHead className="text-right">Monthly Revenue</TableHead>
                      <TableHead className="text-right">Profit Margin</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBusinesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{business.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                              {business.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{business.category}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatAddress(business.owner)}
                        </TableCell>
                        <TableCell className="text-right">
                          {business.tokenSupply.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(business.monthlyRevenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {business.profitMargin}%
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={processingId === business.id}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Business Listing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to verify "{business.name}"? This will make the business 
                                    visible on the platform and allow investors to purchase tokens.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApprove(business.id, business.name)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm Approval
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={processingId === business.id}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Business Listing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject "{business.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleReject(business.id, business.name)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Confirm Rejection
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}
