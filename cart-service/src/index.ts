import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../proto/cart.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const cartPackage = grpcObj.cart;

const carts: Record<string, Array<{ productId: string; quantity: number }>> = {
  'user1': [{ productId: 'apple', quantity: 3 }],
  'user2': [{ productId: 'banana', quantity: 1 }],
};

const server = new grpc.Server();

server.addService(cartPackage.CartService.service, {
  GetCart: (call: any, callback: any) => {
    const userId = call.request.userId;
    console.log(`Received GetCart request for user: ${userId}`);
    const items = carts[userId] || [];
    callback(null, { items });
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Cart service running at 0.0.0.0:50051');
  server.start();
});
