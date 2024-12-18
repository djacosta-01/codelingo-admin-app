export async function GET(request: Request) {
  // console.log('\nGET ROUTE\n')

  return Response.json({ message: 'hi from the api!!!!!! 😊', error: false })
}
