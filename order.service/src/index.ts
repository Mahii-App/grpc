import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../proto/cart.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const cartPackage = grpcObj.cart;

const cartClient = new cartPackage.CartService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

function placeOrder(userId: string) {
  cartClient.GetCart({ userId }, (err: any, response: any) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return;
    }
    console.log(`Placing order for user: ${userId}`);
    console.log('Cart items:', response.items);
    
  });
}

placeOrder('user1');
