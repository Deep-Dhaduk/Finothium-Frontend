import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (roleName, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  // if (roleName === "admin" || roleName === 'super admin') {
  //   can('manage', 'all')
  // } else {
  //   can(['read'], subject)
  // }
  can('manage', 'all')

  return rules
}

export const buildAbilityFor = (roleName, subject) => {
  return new AppAbility(defineRulesFor(roleName, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
