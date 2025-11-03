import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export interface ProductCompliance {
  ProductID: string;
  Flags: {
    FSSAICodes: any[];
    HasConsumerCareDetails: boolean;
    HasFSSAI: boolean;
    HasManufacturerDetails: boolean;
    HasNutritionalInfo: boolean;
    IsCompliant: boolean;
  };
  LastChecked: string;
}

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getAllProducts(): Promise<ProductCompliance[]> {
  try {
    const command = new ScanCommand({
      TableName: 'ProductComplianceSummary',
    });

    const response = await dynamoDBClient.send(command);
    
    if (!response.Items) {
      return [];
    }

    // Convert DynamoDB format to normal JavaScript objects
    return response.Items.map(item => {
      const unmarshalledItem = unmarshall(item);
      return {
        ProductID: unmarshalledItem.ProductID,
        Flags: unmarshalledItem.Flags || {},
        LastChecked: unmarshalledItem.LastChecked
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}