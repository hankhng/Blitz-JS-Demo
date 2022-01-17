import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

// export default (input, ctx) => result
// this is the signature

// scaffold code out with this resolver utility that uses the functional pipe
// the pipe allows us to chain the resolvers together and handles typescript magic
export default resolver.pipe(
  resolver.zod(GetProject),
  // zod is a schema validation library that allows us to validate the input
  resolver.authorize(), // can also add authorize('ADMIN') to ensure user has role of admin
  //  authorize is a middleware that checks if the user is logged in
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.findFirst({ where: { id } })

    if (!project) throw new NotFoundError()

    return project
  }
)

// server side code
