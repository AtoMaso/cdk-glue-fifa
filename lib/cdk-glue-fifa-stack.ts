import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkGlueFifaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkGlueFifaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Create a new Role for Glue
     const role = new iam.Role(this, 'access-glue-fifa', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });
    
    // Add AWSGlueServiceRole to role.
    const gluePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSGlueServiceRole");
    role.addManagedPolicy(gluePolicy);



      // Create a new S3 bucket for Glue job.
      const bucketName = '<ID>-fifa';
      const dataBucketName = '<ID>-data';
  
      const glueS3Bucket = new s3.Bucket(this, 'GlueFifaBucket', {
        versioned: true,
        bucketName: bucketName,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: true
      });
      
      // Assign role to S3 bucket
      glueS3Bucket.grantReadWrite(role);
  
      // Assign permission to data bucket
      const dataS3Bucket = s3.Bucket.fromBucketName(this, 'existingBucket', dataBucketName);
  
      dataS3Bucket.grantReadWrite(role);

  }
}
